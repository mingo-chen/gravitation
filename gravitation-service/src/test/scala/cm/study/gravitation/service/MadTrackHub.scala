package cm.study.gravitation.service

import cm.study.gravitation.dsl.DSLDef._kv_pair

class MadTrackHub {

}

object MadTrackHub {

  def main(args: Array[String]): Unit = {

    val conf = Map("address" -> "gz")

    println("--> " + conf)
    println("--> " + conf.get("name").getOrElse("none"))
  }
}
