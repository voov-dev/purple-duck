import React from "react";
import Duck from "./Duck";

function Board(props) {
    return (
        <div className="board">
            <div className="board__hero-box">
                <Duck onClick={() => props.onClick()}
                      isHit={props.isHit}
                      isJump={props.isJump} />
            </div>
            <div className="board__health">{`HP ${props.health} / ${props.maxHealth}`}</div>
        </div>
    )
}

export default Board;