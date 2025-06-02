// Next.js 13+ 的 App Router 要求显式声明客户端组件，以便使用 React 的客户端功能（如 useState 和 useEffect）。
// "use client" 确保组件在客户端运行，因为 useEffect 和 useState 依赖浏览器环境。
"use client"; // 声明这是一个React 客户端组件，告诉 Next.js 在客户端渲染该组件，而不是在服务器端渲染

// 导入 react-geocode 库的 setDefaults 和 fromAddress 函数，用于配置和调用 Google Geocoding API。
import { setDefaults, fromAddress } from "react-geocode";
//导入 React 的 useState 和 useEffect Hooks，用于管理组件状态和副作用。
import { useEffect, useState } from "react";

const PropertyMap = ({ property }) => {
  // 使用 useState 定义状态, 存储地址的经纬度，初始值为 null
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  // viewport：存储地图视图配置（如中心坐标和缩放级别）
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
  });
  // loading：布尔值，表示是否正在加载地理编码数据，初始为 true。
  const [loading, setLoading] = useState(true);
  // geocodeError：布尔值，表示地理编码是否出错，初始为 false。
  const [geocodeError, setGeocodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // 从环境变量获取 API 密钥
    language: "en", //返回英文结果
    region: "us", // 优先返回美国地区的地理数据
  });

  // 使用 useEffect 在组件挂载时运行一次（空依赖数组 []）。
  useEffect(() => {
    // fetchCoords 异步函数 - 在组件挂载时运行 fetchCoords，避免阻塞渲染。
    const fetchCoords = async () => {
      try {
        // 调用 fromAddress，将 property.location 的地址拼接为字符串，发送给 Google Geocoding API
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        // 检查响应：如果 res.results 为空，设置 geocodeError 为 true 并返回。
        if (res.results.length === 0) {
          setGeocodeError(true);
          return;
        }

        // 从响应中提取 lat 和 lng，更新状态，并更新 viewport 的坐标
        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false); // 无论成功或失败，设置 loading 为 false
      }
    };

    fetchCoords();
  }, []);

  // 如果 loading 为 true，显示“Loading...”。
  if (loading) return <h3>Loading...</h3>;
  //如果 geocodeError 为 true，显示“No location data found”。
  if (geocodeError)
    return <div className="text-xl">No location data found</div>;

  return <div>Map</div>;
};

export default PropertyMap;
