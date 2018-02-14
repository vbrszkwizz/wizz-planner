import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import './summary.css';

const Summary = () => {
  const style = {
    width: 830
  };

  return (
    <Card style={style} zDepth={2} className="summary">
      <CardTitle title="summary" />
      <CardText>
        Lorem ipsum dolor amet intelligentsia hexagon glossier, butcher ennui
        paleo portland taiyaki taxidermy skateboard. Marfa enamel pin keffiyeh
        cray. Fam banjo brooklyn, pour-over swag disrupt waistcoat microdosing
        meditation sriracha jean shorts tumeric. Authentic chicharrones sriracha
        sustainable woke tattooed humblebrag banh mi. Literally meggings etsy
        williamsburg. Banjo air plant YOLO salvia hoodie.
      </CardText>
    </Card>
  );
};

export default Summary;
