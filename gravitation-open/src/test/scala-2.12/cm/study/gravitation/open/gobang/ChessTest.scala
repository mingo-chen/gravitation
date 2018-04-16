package cm.study.gravitation.open.gobang

import cm.study.gravitation.open.gobang.GobangServer.formats
import org.scalatest.FunSuite
import org.json4s._
import org.json4s.jackson.Serialization._
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods
import org.json4s.jackson.JsonMethods._

class ChessTest extends FunSuite {

  test("json case class") {
    val result = AttackResult(false, "还没轮到你下!", false, "")
    implicit val formats = DefaultFormats

    println(write(result))

//    val data = parse(write(result))
    val data = JsonMethods.mapper.writeValueAsString(Extraction.decompose(result)(formats))
    val json = ("code" -> 200) ~ ("data" -> JsonMethods.parse(data))

    println(write(json))
  }
}
