package cm.study.gravitation.open.gobang

import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import org.json4s.{DefaultFormats, Extraction}

import scala.collection.mutable
import scala.io.StdIn
import util.control.Breaks._
import org.json4s.jackson.{JsonMethods, Serialization}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import spray.json.DefaultJsonProtocol._


/**
  * 五子棋服务端
  */
object GobangServer {
  implicit val formats = DefaultFormats

  def success(data: Any): String = {
    val data_2_json: String = JsonMethods.mapper.writeValueAsString(Extraction.decompose(data)(formats))
    s"""{"code":200, "data": $data_2_json}"""
  }

  def fail(message: String): String = {
    s"""{"code":500, "message": "$message"}"""
  }

  def main(args: Array[String]): Unit = {
    implicit val system = ActorSystem("my-system")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    implicit val orderFormat = jsonFormat2(ChatMessage)

    val route =
      path("login" / Remaining ) { playerId =>
        pathEnd {
          // 登录, 寻找对手; 寻找成功, 就返回参加双方, 先手等信息
          val rt = Chess.findOpponent(playerId)
          println(s"#DEBUG# [Login] [$playerId], 尝试对战: $rt")

          complete {
            getFromResource()
            success(rt)
          }
        }

      } ~
      path("attack" / IntNumber / IntNumber / "of" / Remaining) { (x, y, playerId) =>
        pathEnd {
          post {
            complete {
              try {
                val rt = Chess.attack(playerId, x, y)
                println(s"#DEBUG# [Attack] [$playerId] at ($x, $y), rt: $rt")
                success(rt)

              } catch {
                case re: RuntimeException => {
                  fail(re.getMessage)
                }

                case ex: Exception => {
                  fail(ex.getMessage)
                }
              }

            }
          }
        }

      } ~
      path("get" / Remaining) { playerId =>
        pathEnd {
          // 返回当前对局的相关信息
          complete {
            val reqTime = System.currentTimeMillis()

            var events = mutable.MutableList[ChessEvent]()

            breakable {
              while(System.currentTimeMillis() - reqTime < TimeUnit.SECONDS.toMillis(30)) {
                events = Chess.getEvents(playerId)
                if(events.isEmpty) {
                  TimeUnit.MILLISECONDS.sleep(500)
                  val wait_time = (System.currentTimeMillis() - reqTime) / 1000
                  println(s"#DEBUG# [GET] [$playerId] loop wait events, wait time: $wait_time, sleep 1 seconds...")
                } else {
                  // 退出循环
                  break()
                }
              }
            }

            // hold 5 second
            success(events)
          }
        }
      } ~
      path("chat") {
        pathEnd {
          post {
            entity(as[ChatMessage]) { message =>
              println(s"receive message: $message")

              complete {
                Chess.chat(message.sender, message.body)
                success("")
              }
            }

          } ~
          get {
            complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, "<h1>Say hello to akka-http</h1>"))
          }
        }
      }


    val bindingFuture = Http().bindAndHandle(route, interface = "0.0.0.0", port = 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine() // let it run until user presses return

    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done

  }

  def player_login(playerId: String): HttpResponse = {
    null
  }
}
