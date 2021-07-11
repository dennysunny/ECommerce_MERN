const mongoose = require("mongoose")
const crypto   = require("crypto")
const uuidv1   = require("uuid/v1")

var userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },

    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    userinfo: {
        type: String,
        trim: true
    },

    encry_password: {
        type: String,
        required: true
    },

    salt: String,

    role: {
        type: Number,
        default: 0
    },

    purchase: {
        //user can purchase multiple items
        type: Array,
        default: [] //empty while creating acc
    }

},{timestamps: true}
)

//virtual fields
//insted of saving pwd directly to encry pwd, pwd is saved to this virtual field and then assignes encrypted pwd to encry_password
userSchema.virtual("password")
//pwd entered by user
    .set(function(password){
        this._password = password; //private var
        this.salt      = uuidv1(); //universally unique identifier is a 128-bit label used for information
        this.encry_password = this.securePassword(password)
    })

    .get(function(){
        return this._password
    })




//method which returns encrypted pwd
//crypto npm
userSchema.methods = {

    securePassword: function(planePassword){
        
        if(!planePassword) return "";

        try{
            return crypto.createHmac('sha256', this.salt) //will convert plane pwd to a secure pwd, salt = uuid created earlier
            .update(planePassword)
            .digest('hex');

        }catch(err){
            return "";
        }
    },

    authenticate: function(planePassword){
        return this.securePassword(planePassword) === this.encry_password
    }


}



module.exports = mongoose.model("User", userSchema)