import { Input, Label } from "reactstrap";

export default function Recovery() {
    return (
        <div id="main">
        <div id="loginBox" className="Glass">
          <h4 style={{fontWeight:'bold'}}>
            بازیابی رمز عبور
          </h4>
          <Label className="mt-3">شماره موبایل</Label>
          <Input className="Glass loginInput"/>
          <button className="NiceButton mb-3 mt-3">بازیابی</button>
          <a className="mt-4" style={{color:'inherit', textDecoration:'none'}} href="/">بازگشت به صفحه اصلی</a>
        </div>
      </div>
    )
}