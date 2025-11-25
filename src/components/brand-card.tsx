import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
  name: string;
  imageSrc: string;
  href: string;
}

const BrandCard = ({ name, imageSrc, href }: BrandCardProps) => {
  return (
    <Link href={href}>
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform cursor-pointer border border-gray-200">
        <div className="relative w-32 h-32">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;
