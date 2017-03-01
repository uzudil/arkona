export default class {
	constructor(info, events) {
		this.info = info || {}
		this.events = events
		this.health = this.info["health"] || 10
		this.strength = this.info["strength"] || 10
		this.attackWait = this.info["attackWait"] || 1500
		this.lastAttack = 0
	}

	attack(other) {
		let now = Date.now()
		if(now - this.lastAttack > this.attackWait) {
			this.lastAttack = now
			other.takeDamage((Math.random() * this.strength)|0)
			return true
		} else {
			return false
		}
	}

	takeDamage(damage) {
		this.health -= damage
		this.events.onDamage(damage)
		if(this.health <= 0) {
			this.events.onDeath()
		}
	}
}
