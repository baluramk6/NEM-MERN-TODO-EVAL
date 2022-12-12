import React from "react";

export const Signin = () => {
  return (
    <div>
      <h1>Signin</h1>
      <div>
        <label htmlFor="">Email </label>
        <input type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="">Password </label>
        <input type="email" placeholder="Password" />
      </div>
      <div>
        <button>Signin</button>
      </div>
    </div>
  );
};
