
const BasicBufSize = 1024;

class BinaryWriter {
	constructor(){
		this._init()
	}
	_init(){
		this.buf = new Buffer(BasicBufSize);
		this.allBufs = [this.buf];
		this.pos = 0		
	}
	_truncateLastBuf(){
		this.allBufs[this.allBufs.length-1] = this.buf.slice(0, this.pos)
	}
	_ensure(n){
		const rem = this.buf.length - this.pos;
		if(rem < n){
			const nextBufSize = Math.max(n*2, BasicBufSize);
			this._truncateLastBuf()
			this.pos = 0
			this.buf = new Buffer(nextBufSize);
		}
	}

	putNumber(n: number){
		this._ensure(8)
		this.buf.writeDoubleLE(n, this.pos)
		this.pos += 8
	}
	putFloat(n: number){
		this._ensure(4)
		this.buf.writeFloatLE(n, this.pos)
		this.pos += 4
	}
	putInt(n: number){
		this._ensure(4)
		this.buf.writeInt32LE(n, this.pos)
		this.pos += 4
	}
	putBuffer(buf){
		if (buf instanceof ArrayBuffer) buf = Buffer.from(buf);

		this._ensure(buf.length)
		buf.copy(this.buf, this.pos)
		this.pos += buf.length
	}

	takeData() {
		this._truncateLastBuf()
		const res = Buffer.concat(this.allBufs)
		this._init()
		return res
	}
}
export function make(){
	return new BinaryWriter()
}