<template>
  <div id="mapContainer" ref="allmap"></div>
</template>

<script>
export default {
  data() {
    return {
      map: ""
    };
  },
  methods: {
    getMap() {
      // 百度地图API功能
      this.map = new BMap.Map(this.$refs.allmap); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
      var mapStyle = {
        features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
        style: "googlelite"
      };
      this.map.setMapStyle(mapStyle);
      //   this.map.addEventListener("zoomend", 12);
      // this.map.enableScrollWheelZoom(true);
    },
    cavLine(v) {
      // console.log(v);
      if (v != "") {
        if (v.kmlLines.length > 0) {
          let points = [];
          v.kmlLines[0].points.forEach(vv => {
            points.push(new BMap.Point(vv.longitude, vv.latitude));
          });
          var polyline = new BMap.Polyline(points);
          this.map.centerAndZoom(points[0], 11); //设置中心坐标及默认缩放级别
          this.map.addOverlay(polyline);
        } else {
          let points = [];
          v.kmlPoints.forEach(vv => {
            points.push(
              new BMap.Point(vv.points[0].longitude, vv.points[0].latitude)
            );
          });
          var polyline = new BMap.Polyline(points);
          this.map.centerAndZoom(points[0], 11); //设置中心坐标及默认缩放级别
          this.map.addOverlay(polyline);
        }
      }else{
        this.map.clearOverlays()
      }
    }
  },
  mounted() {
    this.getMap();
  }
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 300px;
}
</style>
