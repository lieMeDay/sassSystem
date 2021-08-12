import Vue from 'vue'
// 图片列表放大
Vue.directive('showImgArr', {
    bind(el, arr) {
        let li = arr.value
        el.addEventListener('click', function (e) {
            e.stopPropagation()
            // const imgSrc = el.getAttribute('src'); //获取当前的图片链接
            let imgSrc = li.list[li.ind]
            // console.log(imgSrc, li.ind)
            let _showImg_ = document.getElementById('__showImg__')
            let leftBtn = document.getElementById('leftBtn')
            let dirImg = document.getElementById('dirImg')
            let rightBtn = document.getElementById('rightBtn')
            if (_showImg_) {
                _showImg_.style.display = 'flex';
                // const childImg = _showImg_.childNodes[0]
                // childImg.setAttribute('src', imgSrc)
                dirImg.src = imgSrc
            } else {
                _showImg_ = document.createElement('div');
                const body = document.body
                _showImg_.innerHTML = `<i class="el-icon-arrow-left" id="leftBtn" style="font-size: 80px;color: #fff;" ></i><div style="width:70%;height:90%;overflow:auto;"><img src="${imgSrc}" id="dirImg" style="width:100%;" /></div><i class="el-icon-arrow-right" id="rightBtn" style="font-size: 80px;color: #fff;" ></i>`
                // _showImg_.innerHTML = `<img src="${imgSrc}" style="max-width: 500px;max-height:100%;" />`
                _showImg_.setAttribute('id', '__showImg__');
                _showImg_.setAttribute('style', 'display: flex;justify-content: center;align-items:center;position:fixed;z-index:9999;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.7);');
                body.appendChild(_showImg_);
            }
            _showImg_.addEventListener('click', function (e) {
                e.stopPropagation();
                this.style.display = 'none'
            })
            leftBtn = document.getElementById('leftBtn')
            dirImg = document.getElementById('dirImg')
            leftBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                li.ind = li.ind - 1
                if (li.ind < 0) li.ind = 0
                dirImg.src = li.list[li.ind]
            })
            rightBtn = document.getElementById('rightBtn')
            if (li.list.length <= 1 && leftBtn) {
                leftBtn.style.display = "none";
                rightBtn.style.display = "none";
            } else {
                leftBtn.style.display = "block";
                rightBtn.style.display = "block";
            }
            rightBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                li.ind = ++li.ind
                if (li.ind >= li.list.length - 1) li.ind = li.list.length - 1
                dirImg.src = li.list[li.ind]
            })
        })

    },
    componentUpdated(el, arr) {
        let li = arr.value
        el.addEventListener('click', function (e) {
            e.stopPropagation()
            // const imgSrc = el.getAttribute('src'); //获取当前的图片链接
            let imgSrc = li.list[li.ind]
            let _showImg_ = document.getElementById('__showImg__')
            let dirImg = document.getElementById('dirImg')
            if (_showImg_) {
                _showImg_.style.display = 'flex';
                // const childImg = _showImg_.childNodes[0]
                // childImg.setAttribute('src', imgSrc)
                dirImg.src = imgSrc
            }
            if (li.list.length <= 1 && leftBtn) {
                leftBtn.style.display = "none";
                rightBtn.style.display = "none";
            } else {
                leftBtn.style.display = "block";
                rightBtn.style.display = "block";
            }
        })
    }
})