/*  Schema：Mongoose 的 Schema 构造函数，用于定义文档结构。
    model：Mongoose 的函数，用于创建或获取模型。
    models：Mongoose 的对象，存储已注册的模型，防止重复定义   */
import { Schema, model, models } from "mongoose";

// 定义 UserSchema，描述 User 集合中文档的结构
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"], //确保 email 在集合中唯一，重复会抛出错误（带自定义消息）。
      required: [true, "Email is required"], //不能为空，否则抛出错误。
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    image: {
      type: String,
    },
    // bookmarks（数组): 存储用户收藏的房产 ID 列表，与 bookmarkProperty 功能相关。
    bookmarks: [
      {
        type: Schema.Types.ObjectId, // 存储 MongoDB 的 ObjectId，引用 Property 集合的文档。
        ref: "Property", //指定关联模型为 Property，支持 Mongoose 的 populate 方法查询相关数据。
      },
    ],
  },
  {
    //自动添加 createdAt 和 updatedAt 字段，记录文档的创建和更新时间。
    timestamps: true,
  }
);

/* 创建或获取 User 模型：
   models.User：检查是否已存在 User 模型（避免重复定义）。
   model('User', UserSchema)：如果不存在，创建新模型。*/
const User = models.User || model("User", UserSchema);

export default User;
