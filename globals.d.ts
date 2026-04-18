// Type declarations for CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Type declarations for image modules
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}