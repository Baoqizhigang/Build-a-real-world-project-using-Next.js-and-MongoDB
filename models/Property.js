import {Schema, model, models } from 'mongoose';

const PropertySchema = new Schema (
    {
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        requried: true
    },
    description: {
        type: String,
    },
    location: {
        street: String,
        city: String,
        state: String,
        zipcode: String
    },
    beds: {
        type: Number,
        required: true
    }, 
    bath: {
        type: Number,
        required: true
    }, 
}, 
{
    timestamps: true
}); 

const Property = models.Property || model('Property', PropertySchema);

export default Property;