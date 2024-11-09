import boto3
import os
from fastapi import UploadFile
import uuid

class S3Handler:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        self.bucket_name = os.getenv('S3_BUCKET_NAME')

    async def upload_profile_picture(self, file: UploadFile, username: str) -> str:
        # Generate unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"profile-pictures/{username}/{str(uuid.uuid4())}.{file_extension}"
        
        # Upload to S3
        self.s3_client.upload_fileobj(
            file.file,
            self.bucket_name,
            unique_filename,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )
        
        # Return the URL of the uploaded file
        return f"https://{self.bucket_name}.s3.amazonaws.com/{unique_filename}"

    async def delete_profile_picture(self, image_url: str):
        if not image_url:
            return
            
        try:
            # Extract key from URL
            key = image_url.split('.amazonaws.com/')[-1]
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
        except Exception as e:
            print(f"Error deleting image from S3: {e}")
