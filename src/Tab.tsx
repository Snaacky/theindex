import React from "react";

class Tab extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            id: 0
        };
    }

    render() {
        return (
            <div className={"tab"}>
                <button onClick={() => this.setState({id: this.state.id + 1})}>
                    {this.state.id}
                </button>
            </div>
        )
    }
}

export default Tab;