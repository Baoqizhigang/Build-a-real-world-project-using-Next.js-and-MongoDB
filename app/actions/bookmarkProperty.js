"use server"; //服务器动作是处理表单提交或 API 请求的推荐方式，运行在安全环境中（无客户端暴露）。

import connectDB from "@/config/database";
import User from "@/models/User"; //User：Mongoose 模型，包含 bookmarks 字段（ObjectId 数组，引用 Property）。
import { getSessionUser } from "@/utils/getSessionUser"; //获取当前会话用户的 ID
import { revalidatePath } from "next/cache"; //revalidatePath：Next.js 函数，用于失效缓存，触发页面重新生成。

// 功能：允许用户收藏或取消收藏房产，通过更新 User.bookmarks 数组实现。
async function bookmarkProperty(propertyId) {
  await connectDB(); //连接 MongoDB 数据库，确保后续 Mongoose 操作有效

  const sessionUser = await getSessionUser(); //调用 getSessionUser 获取当前会话用户

  // 验证用户是否存在且有 userId，否则抛出错误。
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  // ?????????????
  const { userId } = sessionUser;

  //使用 Mongoose 的 findById 查询 User 集合，获取用户文档
  const user = await User.findById(userId);

  //检查 propertyId 是否已存在于 user.bookmarks 数组（bookmarks 是 ObjectId 数组）。
  let isBookmarked = user.bookmarks.includes(propertyId);

  // ???????????????????
  let message;

  if (isBookmarked) {
    // If already bookmarked, then remove
    user.bookmarks.pull(propertyId); //从 bookmarks 数组移除（pull)
    message = "Bookmark Removed";
    // 注意：isBookmarked = false 和 isBookmarked = true 的赋值语法有问题，因为 isBookmarked 是 const 声明，无法重新赋值。
    isBookmarked = false;
  } else {
    // if not bookmarked, then add
    user.bookmarks.push(propertyId); // 如果未收藏，添加到 bookmarks 数组（push）。
    message = "Bookmark Added";
    isBookmarked = true;
  }

  await user.save(); //保存更新后的用户文档，将 bookmarks 数组的变化写入 MongoDB。
  //失效 /properties/saved 页面的缓存，触发 Next.js 重新生成页面（适用于静态生成或 ISR 页面）。
  revalidatePath("/properties/saved", "page");

  //返回操作结果（message 和 isBookmarked），供客户端处理。
  return {
    message,
    isBookmarked,
  };
}

export default bookmarkProperty; //导出函数，作为服务器动作供客户端调用（例如通过表单动作或 API）
