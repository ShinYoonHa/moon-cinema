const Link = ({ mouseOverEvent, mouseOutEvent, src }) => {
  return <span onMouseOut={mouseOutEvent} onMouseOver={mouseOverEvent}></span>;
};

export default Link;
//
