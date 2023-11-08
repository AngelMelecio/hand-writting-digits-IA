from channels.generic.websocket import AsyncWebsocketConsumer
import json

class BackPropConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connect")
        await self.channel_layer.group_add(
            "progress_group",  # The name of the group
            self.channel_name
        )
        await self.accept()


    async def disconnect(self, close_code):
        print("disconnect")
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def train_details(self, event):
        details = event['text']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'details': details,
        })) 