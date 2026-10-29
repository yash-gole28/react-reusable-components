import { SmartImage } from "./../component/SmartImage";

export default function UserAvatar() {
  return (
    <div>
        <SmartImage
          src="https://i.pravatar.cc/300"
          alt="User"
          aspectRatio="1 / 1"
          containerClassName="w-14 rounded-full"
          className="rounded-full"
          fallbackSrc="/avatar.png"
        />
        
    </div>
  );
}