/**
 * Anything that is alive, can attack and can be killed. Headless creature combat stats.
 */
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
			other.takeDamage(Math.max(1, (Math.random() * this.strength * 0.3 + this.strength * 0.7)|0))
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
