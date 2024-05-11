import React from "react";

interface Props {
  imageUrl: string;
  url: string;
  title: string;
  category: string;
  description: string;
  id: number;
}

export const Card: React.FC<Props> = ({
  imageUrl,
  url,
  title,
  category,
  description,
  id,
}) => {
  return (
    <div
      key={id}
      className="shadow bg-orange-500 max-w-md  rounded text-amber-950 font-comfortaa"
    >
      <img src={imageUrl} />
      <div className="p-5 flex flex-col space-y-2">
        <p className="text-sm text-orange-700">{category}</p>
        <p className="text-lg font-medium">{title}</p>
        <p className="text-gray-600">{description}</p>
        {/* <a href={url} className="flex hover:text-blue-500 font-sans">
          {url}
        </a> */}
      </div>
    </div>
  );
};
