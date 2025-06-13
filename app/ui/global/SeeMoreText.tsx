import React, { useState } from "react";
import { useTranslations } from "next-intl";

const SeeMoreText = ({ text, maxLength = 100 }) => {
  const t = useTranslations("Global");
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => setIsExpanded(!isExpanded);

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {isExpanded ? text : `${text.substring(0, maxLength)}... `}
      <span onClick={toggleText} className="text-green-800 cursor-pointer">
        {isExpanded ? t("see_less") : t("see_more")}
      </span>
    </p>
  );
};

export default SeeMoreText;
