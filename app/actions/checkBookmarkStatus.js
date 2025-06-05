"use server"; //服务器动作是处理表单提交或 API 请求的推荐方式，运行在安全环境中（无客户端暴露）。

import connectDB from "@/config/database";
import User from "@/models/User"; //User：Mongoose 模型，包含 bookmarks 字段（ObjectId 数组，引用 Property）。
import { getSessionUser } from "@/utils/getSessionUser"; //获取当前会话用户的 ID
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";

async function checkBookmarkStatus(propertyId) {
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

  return { isBookmarked };
}

export default checkBookmarkStatus;
