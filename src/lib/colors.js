// 认证机构专业配色系统
// 主色：万达蓝（体现专业稳重）
// 辅色：金色/琥珀色（象征创新与价值）
// 强调色：青绿色（象征双碳与可持续）

export const colors = {
  // 主色调 - 万达蓝系
  primary: {
    50: '#e6f0f7',
    100: '#b3d1e6',
    200: '#80b2d4',
    300: '#4d93c2',
    400: '#1a74b0',
    500: '#003D79', // 万达蓝主色
    600: '#003366',
    700: '#002952',
    800: '#001f3d',
    900: '#001529'
  },
  
  // 辅助色 - 金色系
  secondary: {
    50: '#fdf8e7',
    100: '#f9e9b8',
    200: '#f5da89',
    300: '#f1cb5a',
    400: '#edbc2b',
    500: '#D4AF37', // 金色主色
    600: '#b8972f',
    700: '#9c7f27',
    800: '#80671f',
    900: '#644f17'
  },
  
  // 强调色 - 青绿色系
  accent: {
    50: '#e6f7f5',
    100: '#b3e8e0',
    200: '#80d9cc',
    300: '#4dcab7',
    400: '#1abba3',
    500: '#00A896', // 青绿色主色
    600: '#008f7a',
    700: '#00755e',
    800: '#005c42',
    900: '#004226'
  },
  
  // 中性色 - 专业灰度
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  
  // 状态色
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3'
  },
  
  // 背景色
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
  },
  
  // 文字色
  text: {
    primary: '#212121',
    secondary: '#424242',
    tertiary: '#757575',
    disabled: '#9e9e9e'
  }
};

// Tailwind CSS 类名映射
export const colorClasses = {
  // 主色调类
  primary: {
    bg: 'bg-[#003D79]',
    text: 'text-[#003D79]',
    border: 'border-[#003D79]',
    hover: 'hover:bg-[#003366]',
    gradient: 'bg-gradient-to-r from-[#003D79] to-[#003366]'
  },
  
  // 辅助色类
  secondary: {
    bg: 'bg-[#D4AF37]',
    text: 'text-[#D4AF37]',
    border: 'border-[#D4AF37]',
    hover: 'hover:bg-[#b8972f]',
    gradient: 'bg-gradient-to-r from-[#D4AF37] to-[#b8972f]'
  },
  
  // 强调色类
  accent: {
    bg: 'bg-[#00A896]',
    text: 'text-[#00A896]',
    border: 'border-[#00A896]',
    hover: 'hover:bg-[#008f7a]',
    gradient: 'bg-gradient-to-r from-[#00A896] to-[#008f7a]'
  },
  
  // 中性色类
  neutral: {
    bg: 'bg-[#f5f5f5]',
    text: 'text-[#424242]',
    border: 'border-[#e0e0e0]',
    hover: 'hover:bg-[#eeeeee]'
  },
  
  // 背景色类
  background: {
    primary: 'bg-white',
    secondary: 'bg-[#fafafa]',
    gradient: 'bg-gradient-to-br from-white via-[#f8f9fa] to-[#f5f5f5]'
  },
  
  // 文字色类
  text: {
    primary: 'text-[#212121]',
    secondary: 'text-[#424242]',
    tertiary: 'text-[#757575]'
  }
};

// 按钮样式
export const buttonStyles = {
  primary: 'bg-[#003D79] hover:bg-[#003366] text-white border-[#003D79]',
  secondary: 'bg-[#D4AF37] hover:bg-[#b8972f] text-white border-[#D4AF37]',
  accent: 'bg-[#00A896] hover:bg-[#008f7a] text-white border-[#00A896]',
  outline: 'bg-transparent hover:bg-[#f5f5f5] text-[#003D79] border-[#003D79]',
  ghost: 'bg-transparent hover:bg-[#f5f5f5] text-[#424242]'
};

// 卡片样式
export const cardStyles = {
  primary: 'bg-white border-[#e0e0e0] shadow-sm hover:shadow-md',
  secondary: 'bg-[#fafafa] border-[#e0e0e0]',
  gradient: 'bg-gradient-to-br from-white to-[#f8f9fa] border-[#e0e0e0]'
};

// 输入框样式
export const inputStyles = {
  base: 'border-[#e0e0e0] focus:border-[#003D79] focus:ring-[#003D79]',
  error: 'border-[#f44336] focus:border-[#f44336] focus:ring-[#f44336]',
  success: 'border-[#4caf50] focus:border-[#4caf50] focus:ring-[#4caf50]'
};

// 状态色类
export const statusColors = {
  success: 'bg-[#4caf50] text-white',
  warning: 'bg-[#ff9800] text-white',
  error: 'bg-[#f44336] text-white',
  info: 'bg-[#2196f3] text-white'
};

// 渐变背景
export const gradientBackgrounds = {
  primary: 'bg-gradient-to-br from-[#003D79] via-[#003366] to-[#002952]',
  secondary: 'bg-gradient-to-br from-[#D4AF37] via-[#b8972f] to-[#9c7f27]',
  accent: 'bg-gradient-to-br from-[#00A896] via-[#008f7a] to-[#00755e]',
  neutral: 'bg-gradient-to-br from-[#fafafa] via-[#f5f5f5] to-[#eeeeee]'
};

// 阴影效果
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl'
};

// 圆角效果
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
};

// 间距系统
export const spacing = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
};

// 文字大小
export const typography = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};

// 字体权重
export const fontWeight = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

// 响应式断点
export const breakpoints = {
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:'
};

// 动画效果
export const animations = {
  transition: 'transition-all duration-300 ease-in-out',
  hover: 'hover:scale-105 hover:shadow-lg',
  focus: 'focus:outline-none focus:ring-2 focus:ring-[#003D79] focus:ring-opacity-50'
};

// 主题配置
export const theme = {
  colors,
  colorClasses,
  buttonStyles,
  cardStyles,
  inputStyles,
  statusColors,
  gradientBackgrounds,
  shadows,
  borderRadius,
  spacing,
  typography,
  fontWeight,
  breakpoints,
  animations
};

export default theme;