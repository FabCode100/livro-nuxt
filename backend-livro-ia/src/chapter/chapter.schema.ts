import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ChapterDocument = Chapter & Document

@Schema()
export class Chapter {
    @Prop({ required: true })
    prompt: string

    @Prop({ required: true })
    capitulo: string

    @Prop({ required: true })
    ordem: number

    @Prop({ required: true })
    bookId: string  

    @Prop({ default: () => new Date() })
    criadoEm: Date
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter)
