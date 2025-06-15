import React,{useState} from 'react'

export default function newsletter() {
     let [value1, setValue] = useState("");
  return (
   <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center hero2 w-250 h-70">
              <h1 className="text-5xl font-bold">
                Get Exclusive Offers On Your Email
              </h1>
              <br />
              <p>Subscribe to our newsletter and stay updated</p>
              <br />
              <br />
              <div className="flex">
                <input
                  value={value1}
                  onInput={(e) => {
                    setValue(e.target.value);
                  }}
                                className="border-2 h-14 w-130 rounded-full text-md border-gray-400"
                                style={{ paddingLeft: "15px" }}
                  placeholder="Your email id"
                  type="email"
                />
                <button className="bg-black text-white rounded-full h-14 w-35 relative right-15">
                  Subscribe
                </button>
              </div>
            </div>
                </div>
  )
}
