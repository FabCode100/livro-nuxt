import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'bson'

@Schema()
export class Book {
    @Prop({ required: true })
    titulo: string

    @Prop({ default: Date.now })
    criadoEm: Date

    @Prop({ required: false }) 
    capa?: string
}

export type BookDocument = Book & Document & { _id: ObjectId }
export const BookSchema = SchemaFactory.createForClass(Book)
