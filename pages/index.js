import react, { useState } from "react";
import { Input, Label } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";
export default function Home() {
  return (
    <div id="main">
      <div id="loginBox" className="Glass">
        <h4 style={{fontWeight:'bold'}}>
          به پنتا خوش‌ آمدید!
        </h4>
        <Label className="mt-3">نام کاربری</Label>
        <Input className="Glass loginInput"/>
        <Label>رمز عبور</Label>
        <Input className="Glass loginInput" type="password"/>
        <div style={{textAlign:'right', padding:'0px'}}>
          <Checkbox style={{color:'rgb(200,200,200)', marginRight:'0px'}} />
          <Label>به‌خاطر بسپار</Label>
        </div>
        <button className="NiceButton mb-3">ورود</button>
        <a className="mt-4" style={{color:'inherit', textDecoration:'none'}}>رمز عبور خود را فراموش کرده‌اید؟</a>
      </div>
    </div>
  );
}
