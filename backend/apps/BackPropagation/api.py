import os 
from PIL import Image
import numpy as np

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser

from apps.BackPropagation.models import BackPropagation
from apps.Weights.models import Weights

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

epochs = 50
lr = 0.01
inputLayerNeurons = 784
hiddenLayerNeurons = 128
outputLayerNeurons = 1
batch_size = 50

@api_view(['GET','POST'])
@parser_classes([MultiPartParser , JSONParser])
def backPropagation_api_view(request):
    if request.method == 'POST':
        print('Decoding images...')

        inputs = []
        expected_outputs = []

        for indx, clase in enumerate(request.data.get('clases')):
            # get the pixels of each image in the class folder
            path = os.path.join('examples',str(clase) )
            for image in os.listdir(path):
                image_path = os.path.join(path,image)
                img = Image.open(image_path)
                img_gray = img.convert('L')
                gray_array = np.array(img_gray)
                flat_gray_array = gray_array.flatten()
                flat_gray_array = flat_gray_array / 255
                inputs.append(flat_gray_array)
                expected_outputs.append([indx])

        # Training
        print('Training...')
        
        inputs = np.array(inputs)
        expected_outputs = np.array(expected_outputs)
        
        # generate a random permutation of the inputs and expected outputs
        random_permutation = np.random.permutation(inputs.shape[0])
        inputs = inputs[random_permutation]
        expected_outputs = expected_outputs[random_permutation]
        
        # divide the inputs and expected outputs into training and testing sets
        training_inputs = inputs[:int(inputs.shape[0] * 0.8)]
        training_expected_outputs = expected_outputs[:int(expected_outputs.shape[0] * 0.8)]

        testing_inputs = inputs[int(inputs.shape[0] * 0.8):]
        testing_expected_outputs = expected_outputs[int(expected_outputs.shape[0] * 0.8):]

        # Xavier/Glorot Initialization for hidden layer
        bound_hidden = np.sqrt(6. / (inputLayerNeurons + hiddenLayerNeurons))
        hidden_weights = np.random.uniform(-bound_hidden, bound_hidden, (inputLayerNeurons, hiddenLayerNeurons))

        # Xavier/Glorot Initialization for output layer
        bound_output = np.sqrt(6. / (hiddenLayerNeurons + outputLayerNeurons))
        output_weights = np.random.uniform(-bound_output, bound_output, (hiddenLayerNeurons, outputLayerNeurons))

        """
        # Random Initialization
        hidden_weights = np.random.uniform(size=(inputLayerNeurons, hiddenLayerNeurons))
        output_weights = np.random.uniform(size=(hiddenLayerNeurons, outputLayerNeurons))
        """

        hidden_bias = np.random.uniform(size=(1, hiddenLayerNeurons))
        output_bias = np.random.uniform(size=(1, outputLayerNeurons))

        num_batches = int(training_inputs.shape[0] / batch_size)

        for _ in range(epochs+1):
            for batch_num in range(num_batches):

                start_idx = batch_num * batch_size
                end_idx = (batch_num + 1) * batch_size
                
                # Extract batches
                batch_inputs = training_inputs[start_idx:end_idx]
                batch_expected_outputs = training_expected_outputs[start_idx:end_idx]

                # Forward Propagation
                hidden_layer_activation = np.dot(batch_inputs, hidden_weights)
                hidden_layer_activation += hidden_bias
                hidden_layer_output = sigmoid(hidden_layer_activation)

                output_layer_activation = np.dot(hidden_layer_output, output_weights)
                output_layer_activation += output_bias
                predicted_output = sigmoid(output_layer_activation)

                # Backpropagation
                error = batch_expected_outputs - predicted_output
                d_predicted_output = error * sigmoid_derivative(predicted_output)
                
                error_hidden_layer = np.dot(d_predicted_output, output_weights.T)
                d_hidden_layer = error_hidden_layer * sigmoid_derivative(hidden_layer_output)

                # Updating Weights and Biases
                output_weights += np.dot(hidden_layer_output.T, d_predicted_output) * lr
                output_bias += np.sum(d_predicted_output,axis=0,keepdims=True) * lr
                hidden_weights += np.dot(np.array(batch_inputs).T, d_hidden_layer) * lr
                hidden_bias += np.sum(d_hidden_layer,axis=0,keepdims=True) * lr

            if( _ % 10 == 0):
                print('Epoch: ', _)
                print('Error: ', np.mean(np.abs(error)))

                channel_layer = get_channel_layer()
                train_details = {
                        'type': 'train_details',  # This should match the method name in your consumer
                        'text': { 
                            'epoch':_, 
                            'error': np.mean(np.abs(error)),  
                            'progress': _ / epochs * 100
                        },
                    }   
                async_to_sync(channel_layer.group_send)('progress_group', train_details)
        
        print('Done!')

        # 2. Forward Propagate the Test Data
        hidden_layer_activation = np.dot(testing_inputs, hidden_weights)
        hidden_layer_activation += hidden_bias
        hidden_layer_output = sigmoid(hidden_layer_activation)

        output_layer_activation = np.dot(hidden_layer_output, output_weights)
        output_layer_activation += output_bias
        predicted_outputs = sigmoid(output_layer_activation)

        # Convert predictions to binary (assuming a threshold of 0.5)
        binary_predictions = (predicted_outputs > 0.5).astype(int)

        # 3. Evaluate the Performance and send it through the websocket
        accuracy = np.mean(binary_predictions == testing_expected_outputs)
        
        print(f"Accuracy: {accuracy * 100:.2f}%")


        # 4. Save the weights and biases
        back_prop = BackPropagation.objects.create(
            epochs = epochs,
            learning_rate = lr,
            batch_size = batch_size,
            input_size = 1000,
            training_percentage = 0.8,
            accuracy = accuracy
        )
        
        Weights.objects.create(
            backPropagation = back_prop,
            hiden_weights = hidden_weights.tolist(),
            output_weights = output_weights.tolist(),
            hiden_bias = hidden_bias.tolist(),
            output_bias = output_bias.tolist()
        )

        """
        print(np.array(inputs).shape)
        print(np.array(expected_outputs).shape)
        
        print( np.array([ [1,2],[3,4],[5,6] ]).flatten().shape )
        """

        return Response({
            'message': 'Training succesful, the weights and biases has been saved!',
            'accuracy': accuracy * 100,
            }, 
            status=status.HTTP_200_OK)


    if(request.method == 'GET'):
        pass

@api_view(['GET','PUT','DELETE'])
@parser_classes([MultiPartParser, JSONParser])
def backPropagation_detail_api_view(request, pk=None ):
    if request.method == 'GET':
        pass
    if request.method == 'PUT':
        pass
    if request.method == 'DELETE':
        pass