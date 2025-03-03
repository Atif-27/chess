import React from 'react'

export default function layout({children}:{
    children:React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-zinc-800/50">
      <div
        className="w-full max-w-sm md:max-w-3xl"
        style={{
          filter: "drop-shadow(0px 10px 20px rgba(123, 97, 255, 0.4))",
        }}
      >
        {children}
      </div>
    </div>
  );
}


