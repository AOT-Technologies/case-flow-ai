import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AmazonS3Service {
  constructor(private readonly configService: ConfigService) {}
  private readonly s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });
  private readonly bucket = this.configService.get('AWS_BUCKET_NAME');

  // summery : Fetch File from  S3
  // Created By : Don C Varghese

  async getDocument(documentId: string): Promise<any> {
    try {
      let data = await this.s3.getObject(
        { Bucket: this.bucket, Key: documentId }
      ).promise();
      return data.Body ? (data.Body) : new NotFoundException("No item Found")
    } catch (err) {
      console.log(err);
      return new NotFoundException("No item Found")
    }
  }

  // summery : Upload File to S3
  // Created By : Don C Varghese
  async uploadDocument(data: any, fileName: string): Promise<any> {
    try{
    let base64data = new Buffer(data.buffer, 'binary');
    return await this.s3
      .upload({
        Bucket: this.bucket,
        Body: base64data,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();
    } catch (err) {
      throw new BadRequestException("Issue in the doc upload")
    }
  }

  // summery : Delete  File from  S3
  // Created By : Don C Varghese
  async deleteDocument(documentId: string): Promise<any> {
    try {
      let data = await this.s3.deleteObject(
        { Bucket: this.bucket, Key: documentId },
        (error) => {
          if (error != null) {
            console.log('Failed to delete an object: ' + error);
          }
        },
      ).promise();
      return data
    } catch (err) {
      throw new BadRequestException("Issue in the doc delete")
    }
  }
}
