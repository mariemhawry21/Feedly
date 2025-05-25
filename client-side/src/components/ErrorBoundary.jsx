// ErrorBoundary.js
import React from "react";
import errorImg from "../assets/3828537.jpg";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src={errorImg}
            alt="error image"
            style={{ maxWidth: "100%", maxHeight: "500px" }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
