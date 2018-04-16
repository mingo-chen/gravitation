package cm.study.gravitation.dsl

object DSLDef {

  class KVPair[A](key: A) {
    def ~> [B](value: B) = Tuple2(key, value)
  }

  implicit def _kv_pair[A](key: A) = new KVPair[A](key)

}
