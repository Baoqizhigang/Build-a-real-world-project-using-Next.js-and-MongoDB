// Next.js 13+ 的 App Router 要求显式声明客户端组件，以便使用 React 的客户端功能（如 useState 和 useEffect）。
// "use client" 确保组件在客户端运行，因为 useEffect 和 useState 依赖浏览器环境。
"use client"; // 声明这是一个React 客户端组件，告诉 Next.js 在客户端渲染该组件，而不是在服务器端渲染

// 导入 react-geocode 库的 setDefaults 和 fromAddress 函数，用于配置和调用 Google Geocoding API。
import { setDefaults, fromAddress } from "react-geocode";
//导入 React 的 useState 和 useEffect Hooks，用于管理组件状态和副作用。
// useEffect 是 React 的 Hook，用于在组件渲染后执行副作用（如数据获取、DOM 操作）。它接受一个回调函数（第一个参数）和一个依赖数组.
// useEffect(() => {}, []);
import { useEffect, useState } from "react";

//import Map, { Marker } from "react-map-gl";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";
import Spinner from "./Spinner";

const PropertyMap = ({ property }) => {
  // 使用 useState 定义状态, 存储地址的经纬度，初始值为 null
  // Comments from King:因为只有状态才能刷新UI
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  // viewport：存储地图视图配置（如中心坐标和缩放级别）
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
  });

  // swift def: @State var viewport = null;
  // swift get: viewport
  // siwft set: viewport = 1;

  // react def: const [viewport, setViewport] = useState(null);
  // react get: viewport
  // react set: setViewport(1);

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
    // fetchCoords 异步函数 - 在useEffect组件挂载时运行 fetchCoords，避免阻塞渲染。
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
          //  ...表示：展开viewport
          ...viewport,
          latitude: lat,
          longitude: lng,
        });

        // viewport: {
        //     // latitude: number;
        //     // longitude: number;
        //     zoom: number;
        //     width: string;
        //     latitude: number;
        //     longitude: number;
        //   }
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false); // 无论成功或失败，设置 loading 为 false
      }
    };
    // 在回调函数的最后，显式调用 fetchCoords()
    // const fetchCoords = async () => { ... } 仅定义了函数，但不会自动执行。React 不会自动调用 useEffect 回调中定义的函数。
    // fetchCoords() 是显式调用，确保函数在 useEffect 运行时执行，触发地理编码请求。
    // 由于 useEffect 在组件挂载后运行，fetchCoords() 的调用确保组件一加载就立即获取地址的经纬度。
    // 如果没有 fetchCoords()，函数仅被定义但从未执行，API 请求不会发生，状态也不会更新。
    fetchCoords();
  }, []); // 空依赖数组 []：表示 useEffect 的回调函数只在组件挂载（mount）时执行一次,适合静态地址（property.location 不变）。

  // 如果 loading 为 true，显示“Loading...”。
  if (loading) return <Spinner />;
  //如果 geocodeError 为 true，显示“No location data found”。
  if (geocodeError)
    return <div className="text-xl">No location data found</div>;

  return <div>Map</div>;
};

export default PropertyMap;
