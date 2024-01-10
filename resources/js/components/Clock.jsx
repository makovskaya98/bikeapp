import React, {Component} from 'react';

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date(),
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                time: new Date(),
            });
        }, 1000);
    }

    addZeroToNumber(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }

    render() {
        const day = this.addZeroToNumber(this.state.time.getDate());
        const month = this.addZeroToNumber(this.state.time.getMonth() + 1);
        const year = this.state.time.getFullYear();
        const hours = this.state.time.getHours();
        const minutes = this.state.time.getMinutes();
        const seconds = this.addZeroToNumber(this.state.time.getSeconds());

        const formattedTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

        return (
            <div>
                <span className="clock">{formattedTime}</span>
            </div>
        );
    }
}

export default Clock;
