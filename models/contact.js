import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
},
    {
       versionKey: false,
        timestamps: true, 
    }
)

contactSchema.plugin(mongoosePaginate);

export default mongoose.model("Contact", contactSchema);