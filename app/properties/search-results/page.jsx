import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectDB from "@/config/database";
//Property：Mongoose 模型，含字段如 name, description, location, type 等。
import Property from "@/models/Property";
//convertToSerializableObject：自定义工具函数，将 Mongoose 查询结果（非序列化对象）转换为普通 JavaScript 对象，以便在 Next.js 服务器组件中传递给客户端。
import { convertToSerializableObject } from "@/utils/convertToObject";
import { FaArrowAltCircleLeft } from "react-icons/fa";

// 定义异步服务器组件 SearchResultsPage，接受 searchParams（URL 查询参数），解构出 location 和 propertyType。
const SearchResultsPage = async ({
  searchParams: { location, propertyType },
}) => {
  await connectDB(); // 连接 MongoDB 数据库，为后续查询做准备

  // 创建正则表达式 locationPattern，基于 location 参数：
  // location：用户输入的搜索字符串（如城市或街道名）。
  // "i"：忽略大小写（case-insensitive），例如 "New York" 和 "new york" 都匹配。
  const locationPattern = new RegExp(location, "i");

  // 定义 MongoDB 查询对象，使用 $or 运算符，匹配以下任一字段包含 location 的房产：
  // name：房产名称。  description：房产描述。
  // location.street, location.city, location.state, location.zipcode：地址字段（嵌套对象）。
  // 使用正则表达式允许部分匹配，例如搜索 "York" 可匹配 "New York".
  let query = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ],
  };

  if (propertyType && propertyType !== "All") {
    const typePattern = new RegExp(propertyType, "i");
    query.type = typePattern;
  }

  const propertiesQueryResults = await Property.find(query).lean();
  const properties = convertToSerializableObject(propertiesQueryResults);
  console.log(properties);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6">
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-4">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-blue-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>
          {properties.length === 0 ? (
            <p>No Search Results</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
