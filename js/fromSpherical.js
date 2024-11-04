// Coordonnées Sphériques
function fromSpherical() {
  AFRAME.registerComponent('fromspherical', {
    // we will use two angles and a radius provided by the user 
    schema: {
      phi: {},
      theta: {},
      r: {},
    },
    init: function () {
      // lets change it to radians
      let phi = this.data.phi * Math.PI / 180
      let theta = this.data.theta * Math.PI / 180

      // The 'horizontal axis is x. The 'vertical' is y. 
      // The calculations below are straight from the wiki site.
      let z = (-1) * Math.sin(theta) * Math.cos(phi) * this.data.r
      let x = Math.sin(theta) * Math.sin(phi) * this.data.r
      let y = Math.cos(theta) * this.data.r
      // position the element using the provided data
      this.el.setAttribute('position', {
        x: x,
        y: y,
        z: z
      })
      // rotate the element towards the camera
      this.el.setAttribute('look-at', '[camera]')
    }
  })
}

fromSpherical();