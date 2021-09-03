import Modal from "./Modal"
import {signIn} from "next-auth/client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function LoginModal({text, close}) {
    return <Modal close={close}
                  head={
                      "Login required"
                  }
                  body={
                      <>
                          <p>
                              To use this feature you need to login first
                          </p>
                          <kbd>
                              <code>
                                  {text}
                              </code>
                          </kbd>
                      </>
                  }
                  footer={
                      <button className={"btn btn-outline-success"} onClick={signIn}>
                          <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Sign In
                      </button>
                  }/>
}
