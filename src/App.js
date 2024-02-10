import "./App.css";
import { useState } from "react";
const sha1 = require("js-sha1");

function App() {
  const [draftPassword, setDraftPassword] = useState("");
  const [finalPassword, setFinalPassword] = useState("");
  const [count, setCount] = useState("");

  const checkPassword = () => {
    const hash = sha1.create();
    hash.update(draftPassword);
    let new_hash = hash.hex();
    let hashed_pw = new_hash.toUpperCase();
    console.log(hashed_pw);
    let prefix = hashed_pw.slice(0, 5);
    let suffix = hashed_pw.slice(5);
    fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
      .then((response) => response.text())
      .then((data) => {
        let dataArray = data.split("\r\n");
        let hash_count_arr = dataArray.map((item) => item.split(":"));
        for (let i = 0; i < hash_count_arr.length; i++) {
          const received_suffix = hash_count_arr[i][0];
          if (received_suffix === suffix) {
            setCount(hash_count_arr[i][1]);
            break;
          }
        }
      })
      .catch((error) => {
        console.log("Something went wrong while fetching from API.");
      });
  };

  const onInputChange = (event) => {
    setDraftPassword(event.target.value);
  };

  const submitByEnter = (event) => {
    if (event.key === "Enter") {
      setFinalPassword(draftPassword);
      checkPassword();
    }
  };

  const onButtonSubmit = () => {
    setFinalPassword(draftPassword);
    checkPassword();
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mt-3 p-5">
              <h1>Knight Protector</h1>
              <h2>Password Checker</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col d-flex align-items-center justify-content-center">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body">
                <p className="card-text">
                  This tool checks your password against a database of all the
                  passwords that have been used by hackers to hack user
                  accounts.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <div className="input-group mt-5 mb-3 w-50">
                <input
                  type="text"
                  className="form-control"
                  onChange={onInputChange}
                  onKeyDown={submitByEnter}
                  placeholder="Enter password"
                />
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={onButtonSubmit}
                >
                  Check
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {count ? (
                <p>
                  Your password {finalPassword} has been hacked {count} times.
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
