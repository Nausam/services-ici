type BannerProps = {
  title?: string;
  subtitle?: string;
  gradient?: string;
  height?: string;
};

const Banner: React.FC<BannerProps> = ({
  title = "ކޮމްޕެޓިޝަން",
  subtitle = "",
  gradient = "from-cyan-500 to-blue-600",
  height = "h-40 md:h-60 lg:h-72",
}) => {
  return (
    <div
      className={`relative flex justify-center items-center ${height} bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      {/* Pattern Layer */}
      <div className="absolute inset-0 bg-opacity-20 bg-[url('/assets/images/pattern.svg')] mix-blend-overlay"></div>

      {/* Animated Overlay */}
      <div className="absolute w-72 h-72 bg-white opacity-10 rounded-full animate-ping"></div>

      {/* Content */}
      <div className="relative text-center">
        <h1 className="text-white font-bold text-2xl md:text-4xl">{title}</h1>
        {subtitle && (
          <p className="text-white text-lg mt-2 opacity-80">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default Banner;
