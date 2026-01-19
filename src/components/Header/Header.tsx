// src/components/Header/Header.tsx
import logo from "../../assets/dxc-logo.png";
import { HiMiniUserCircle } from "react-icons/hi2";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-purple-700 text-white">
      {/* Logo à esquerda */}
      <img
        src={logo}
        alt="DXC Technology"
        className="w-[120px] h-[80px] ml-4"
      />

      {/* Usuário à direita */}
      <div className="mr-4">
        <HiMiniUserCircle className="w-12 h-12" />
      </div>
    </header>
  );
}
