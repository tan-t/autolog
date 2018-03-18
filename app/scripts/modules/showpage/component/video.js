var component = {
    name:'video-canvas',
    template:`
    <div>
        <video autoplay style="display:none" width="300px" height="200px" :src="blobUrl"></video>
        <canvas width="3200px" height="2400px" style="display:none"></canvas>
    </div>
    `,
    props : ['blobUrl']
};

module.exports = component;

