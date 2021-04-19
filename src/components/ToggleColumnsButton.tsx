import React from "react";
import {BsToggles} from "react-icons/all";
import "./ToggleColumnsButton.css";

interface ToggleColumnsButtonProps {
    toggled: boolean,
    onClick: () => void
}

class ToggleColumnsButton extends React.Component<ToggleColumnsButtonProps> {
    render(): JSX.Element {
        return (
            <BsToggles
                className={"toggle-columns-button"}
                onClick={this.props.onClick}
                title={"Toggle columns"}
                style={{
                    transform: this.props.toggled ? "rotate(180deg)" : "rotate(0deg)"
                }}
            />
        );
    }
}

export default ToggleColumnsButton;
