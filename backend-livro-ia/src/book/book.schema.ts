import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema()
export class Book {
    @Prop({ required: true })
    titulo: string

    @Prop({ default: Date.now })
    criadoEm: Date
}

export type BookDocument = Book & Document & { _id: Types.ObjectId }
export const BookSchema = SchemaFactory.createForClass(Book)
