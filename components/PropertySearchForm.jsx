"use client"; // React 客户端组件，运行在浏览器端，允许使用客户端功能（如 useState 和 useRouter）。
import { useState } from "react"; //React Hook，用于管理表单的状态（location 和 propertyType）。
import { useRouter } from "next/navigation"; //Next.js 的 Hook，用于客户端导航（App Router 专用）。

const PropertySearchForm = () => {
  // 使用 useState 定义两个状态：location：搜索位置（字符串），初始为空字符串。 propertyType：房产类型（字符串），初始为 "All"。
  // 这些状态绑定到表单的输入框和选择框。
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");

  const router = useRouter(); // 获取 Next.js 的路由对象，用于导航。??????

  // handleSubmit：表单提交处理函数
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为（避免页面刷新）。

    // 如果 location 为空且 propertyType 为 "All"，导航到 /properties（可能显示所有房产）。
    if (location === "" && propertyType === "All") {
      router.push("/properties");
    } else {
      // 否则，构造查询字符串（如 ?location=New+York&propertyType=Apartment），导航到 /properties/search-results。
      const query = `?location=${location}&propertyType=${propertyType}`;
      // router.push：客户端导航，更新 URL 并加载目标页面。
      router.push(`/properties/search-results${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // 定义表单，绑定 handleSubmit 到 onSubmit 事件。
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          type="text"
          id="location"
          placeholder="Enter Location (City, State, Zip, etc"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          // 将 <input> 元素的值绑定到 location 状态（由 const [location, setLocation] = useState("") 定义）
          // 受控组件：React 通过 value 控制输入框的值，而不是由 DOM 管理（称为“受控组件”）。这确保 React 状态是输入框的“单一真相来源”。
          value={location}
          // 监听 <input> 的 onChange 事件（用户输入或修改内容时触发），更新 location 状态。
          // e：事件对象（React 的合成事件）。  e.target：指向触发事件的 DOM 元素（这里是 <input>）。 e.target.value：用户在输入框中输入的最新值（字符串）。
          // 执行：调用 setLocation(e.target.value)，将用户输入的值更新到 location 状态，触发组件重新渲染。
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="w-full md:w-2/5 md:pl-2">
        <label htmlFor="property-type" className="sr-only">
          Property Type
        </label>
        <select
          id="property-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Apartment">Apartment</option>
          <option value="Studio">Studio</option>
          <option value="Condo">Condo</option>
          <option value="House">House</option>
          <option value="Cabin Or Cottage">Cabin or Cottage</option>
          <option value="Loft">Loft</option>
          <option value="Room">Room</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};

export default PropertySearchForm;
