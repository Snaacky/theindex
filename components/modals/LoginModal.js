import Modal from "./Modal"

export default function LoginModal({text, close}) {
    return <Modal close={close}
                  head={
                      "Login required"
                  }
                  body={
                      <p>
                          To use this feature you need to login first
                          <br/>
                          {text}
                      </p>
                  }
                  footer={
                      <></>
                  }/>
}
