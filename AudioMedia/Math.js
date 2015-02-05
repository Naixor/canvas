Number.prototype.multiply = function(b){
	if ((typeof b) !== 'number') {
		return console.error("Number must multiply a Number!");
	};
	var m = 0,s1 = this.toString(),s2 = b.toString(); 
	try{m+=s1.split(".")[1].length}catch(e){} 
	try{m+=s2.split(".")[1].length}catch(e){} 
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
}
Number.prototype.divide = function(b){
	var t1 = 0,t2 = 0; 
	try{t1 = this.toString().split(".")[1].length}catch(e){} 
	try{t2 = b.toString().split(".")[1].length}catch(e){}  
	return (Number(arg1.toString().replace(".", ""))/Number(arg2.toString().replace(".", "")))*Math.pow(10,t2-t1); 
}
Number.prototype.inverse = function(){
	return -1*this;
}
;(function(Math){
	'use strict';

	var Vector = function(){
		this._className = 'Math.Vector';
		var args = arguments;
		switch(Object.prototype.toString.call(arguments[0])){
			case '[object Object]': {
				this.setValue(arguments[0].x, arguments[0].y);
				break
			}
			case '[object Array]': {
				this.setValue(arguments[0][0], arguments[0][1]);
				break
			}
			case '[object Number]': {
				this.setValue(arguments[0], arguments[1]);
				break
			}
			default: {
				console.error('Math.Vector: Bad arguments!')
			}
		}
	}
	Vector.prototype = {
		setValue: function(x, y){
			this.x = x || 0;
			this.y = y || 0;
		},
		add: function(vec){
			this.x += vec.x;
			this.y += vec.y;
			return this;
		},
		subtract: function(vec){	
			this.x -= vec.x;
			this.y -= vec.y;
			return this;
		},
		multiply: function(vec) {
			this.x =  this.x.multiply(vec.x);
			this.y = this.y.multiply(vec.y);
			return this;
		},
		divide: function(vec){
			this.x = this.x.divide(vec.x);
			this.y = this.y.divide(vec.y);
			return this;
		},
		toObject: function(){
			return {x: this.x, y: this.y}
		},
		toArray: function(){
			return [this.x, this.y]
		},
		toString: function(){
			return 'x:' + this.x + ', y:' + this.y
		},
		clone: function(){
			return new Vector(this.x, this.y)
		}
	}
	Math.Vector = Vector;
})(Math)
;(function(Math){
	'use strict';

	var Matrix = function(mtx){
		this._className = 'Math.Matrix';
        mtx && this.setValue(mtx)
    }
    Matrix.prototype = {
        setValue: function(mtx){
        	if (Object.prototype.toString.call(mtx) !== '[object Array]') {
        		console.error('Math.Matrix: Bad arguments!')
        	}
            this.data = mtx;
            return this;
        },
        /**
         * 矩阵相加
         * @param {matrix} m
         */ 
        add: function(mtx){
        	var vx = this.data[0].length, vy = this.data.length;
        	if (vy !== mtx.data.length && vx !== mtx.data[0].length) {
        		return console.error('[Math.Matrix add]: Bad Matrix!')
        	}
        	var _data = mtx.data, data = this.data, r = [];
        	for( var m = vy;m--; ){
        		r[m] = [];
        		for( var n = vx;x--; ){
        			r[m][n] = data[m][n] + m.data[m][n]
        		}
        	}
        	this.data = r;
        	return this;
        },
        /**
         * 矩阵相乘
         * @param {matrix} m 被乘的矩阵
         */
        multiply: function(mtx){
            var r = [], data = this.data, _data = mtx.data, vx = _data[0].length, vy = data.length, ml = data[0].length;

            if(_data.length !== ml) {
                return console.error('[Math.Matrix mul]: Bad Matrix!')
            }

        	for( var m = vy;m--; ){
        		r[m] = [];
        		for( var n = vx;n--; ){
        			r[m][n] = 0;
        			for( var p = ml;p--; ){	
	        			r[m][n] += data[m][p].multiply(_data[p][n]);
        			}
        		}
        	}
        	this.data = r;
            return this;
        },
        value:function(){
            return this.data
        },
        toString:function(){
            return this.data.toString()
        }
    }
    Math.Matrix = Matrix;
})(Math)
;(function(Math){
	var SquareBezier = function(points){
		this._init(points)
	}
	SquareBezier.prototype = {
		_init: function(points){
            var p = this.points = points;
            this.m1 = new Math.Matrix();
            this.m2 = new Math.Matrix([
                [ 1,-2, 1],
                [-2, 2, 0],
                [ 1, 0, 0]
			]);
            this.m3 = new Math.Matrix([
                p[0].toArray(),
                p[1].toArray(),
                p[2].toArray(),
                p[3].toArray()
            ]);
            this.m = null
        },
        /**
         * 获取某个时间点计算出来的坐标值,时间线不由此类控制
         */
        get:function(t){
        	var t2 = t.multiply(t);
            this.m1.setValue([
                [t2, t, 1]
            ]);
            this.m = this.m1.multiply(this.m2).multiply(this.m3);
            return new Math.Vector(this.m.value()[0][0], this.m.value()[0][1]);
        }
	}

	var CubicBezier = function(points){
        this._init(points)
    }
    CubicBezier.prototype = {
        _init: function(points){
            var p = this.points = points;
            this.m1 = new Math.Matrix();
            this.m2 = new Math.Matrix([
                [-1, 3,-3, 1],
                [ 3,-6, 3, 0],
                [-3, 3, 0, 0],
                [ 1, 0, 0, 0]
			]);
            this.m3 = new Math.Matrix([
                p[0].toArray(),
                p[1].toArray(),
                p[2].toArray(),
                p[3].toArray()
            ]);
            this.m = null
        },
        /**
         * 获取某个时间点计算出来的坐标值,时间线不由此类控制
         */
        get:function(t){
        	var t2 = t.multiply(t), t3 = t2.multiply(t);
            this.m1.setValue([
                [t3, t2, t, 1]
            ]);
            this.m = this.m1.multiply(this.m2).multiply(this.m3);
            return new Math.Vector(this.m.value()[0][0], this.m.value()[0][1]);
        }
    }
    Math.SquareBezier = SquareBezier;
    Math.CubicBezier = CubicBezier;
})(Math)