package cm.study.gravitation.open.gobang

import java.util.Random

import scala.collection.mutable
import util.control.Breaks._


/**
  * 棋局
  */
class Chess {

  // 先手
  var offensive: String = ""
  var player1Id: String = ""
  var player2Id: String = ""
  // 胜者
  var winner: String = ""

  // 回合数
  var round = 0

  // 棋局数据
  val checkerboard: Array[Array[Int]] = new Array[Array[Int]](Chess.LATTICE_SIZE)

  def this(p1Id: String, p2Id: String) {
    this()
    this.player1Id = p1Id
    this.player2Id = p2Id

    val rand = new Random()

    if(rand.nextInt(2) % 2 == 0) {
      offensive = player1Id
    } else {
      offensive = player2Id
    }

    for(k <- 0 until Chess.LATTICE_SIZE) {
      checkerboard(k) = new Array[Int](Chess.LATTICE_SIZE)

      for(h <- 0 until Chess.LATTICE_SIZE) {
        checkerboard(k)(h) = -1
      }
    }
  }

  /**
    * 出棋
    * @param x
    * @param y
    */
  def attack(playerId: String, x: Int, y: Int): AttackResult = {
    if(!playerId.equals(player1Id) && !playerId.equals(player2Id)) {
      // 是否是此棋局的人
      return AttackResult(false, s"这不是你的棋局: $playerId", false, "")
    }

    if(!winner.isEmpty) {
      return AttackResult(false, s"战斗已经结束, 赢者: $winner", false, "")
    }

    if(round % 2 == 0 && playerId != offensive) {
      // 偶数回合, 先手者下
      return AttackResult(false, "还未轮到你下!", false, "")
    } else if(round % 2 == 1 && playerId == offensive) {
      // 奇数回合, 后手者下
      return AttackResult(false, "还未轮到你下!", false, "")
    }

    if(checkerboard(y-1)(x-1) != -1) {
      return AttackResult(false, "此处已经下过", false, "")
    }

    checkerboard(y-1)(x-1) = (round % 2)
    round = round + 1

    // 发送message

    // check is end
    if(_is_end(x-1, y-1)) {
      winner = playerId
      battleEnd()
      AttackResult(true, "", true, winner)
    } else {
      AttackResult(true, "", false, "")
    }

  }

  /**
    * 战斗结束
    */
  def battleEnd(): Unit = {
    // 保存对局信息

    Chess.waiters_queue.push(player1Id)
    Chess.waiters_queue.push(player2Id)
  }

  /**
    * 判断这一步有无让棋局结束
    */
  def _is_end(x: Int, y: Int): Boolean = {
    // 以(x, y)为圆心, 从水平, 垂直, 右斜, 左斜四个方面去找有无5个棋子连成
    val v_links = _max_link_size(x, y, 1, 0)
    val h_links = _max_link_size(x, y, 0, 1)
    val vh_links = _max_link_size(x, y, 1, -1)
    val hv_links = _max_link_size(x, y, 1, 1)

    println(s"#DEBUG# [IS_END] 水平最大连接数: $v_links, 垂直最大连接数: $h_links, 右斜最大连接数: $vh_links, 左斜最大连接数: $hv_links")
    return v_links >= 5 || h_links >= 5 || vh_links >= 5 || hv_links >= 5
  }

  /**
    * 求指定方向上最大的连接数量
    * @param base_x
    * @param base_y
    * @param direction_x  指定方向, 如果是水平(1, 0), 垂直就是(0, 1), 右斜(1, -1), 左斜(1, 1)
    * @param direction_y
    * @return
    */
  def _max_link_size(base_x: Int, base_y: Int, direction_x: Int, direction_y: Int): Int = {
    val v = checkerboard(base_y)(base_x)
    var linkSize = 1

    // 先向左
    breakable {
      for(offset <- 1 until 5) {
        val offset_x = base_x - offset * direction_x
        val offset_y = base_y - offset * direction_y

        if(offset_x < 0 || offset_y < 0 || offset_x > Chess.LATTICE_SIZE - 1 || offset_y > Chess.LATTICE_SIZE - 1
            || checkerboard(offset_y)(offset_x) != v) {
          break()
        } else {
          linkSize = linkSize + 1
        }
      }
    }

    // 再向右
    breakable {
      for(offset <- 1 until 5) {
        val offset_x = base_x + offset * direction_x
        val offset_y = base_y + offset * direction_y

        if(offset_x < 0 || offset_y < 0 || offset_x > Chess.LATTICE_SIZE - 1 || offset_y > Chess.LATTICE_SIZE - 1
          || checkerboard(offset_y)(offset_x) != v) {
          break()
        } else {
          linkSize = linkSize + 1
        }
      }
    }

    return linkSize
  }
}

/**
  * 下棋事件
  */
trait ChessEvent

/**
  * 进攻事件
  * @param attacker  进攻者
  * @param x         下棋的坐标
  * @param y
  */
case class AttackChessEvent(val flag: Int = 1, attacker: String, x: Int, y: Int, round: Int, end: Boolean, winner: String) extends ChessEvent

/**
  * 消息事件
  * @param sender   发送者
  * @param body     消息体
  */
case class MessageChessEvent(val flag: Int = 2, sender: String, time: Long, body: String) extends ChessEvent

case class BattleChessEvent(val flag: Int = 3, val player1Id: String, val player2Id: String, val offensive: String) extends ChessEvent

/**
  * 开始战斗结果
  * @param player1Id  发起者
  * @param player2Id  对手
  * @param offensive  先手
  */
case class FindResult(val player1Id: String, val player2Id: String, val offensive: String)

/**
  * 发起进攻结果
  * @param effective  是否有效
  * @param message    无效提示
  * @param end        战斗是否结束
  * @param winner     胜者名字
  */
case class AttackResult(effective: Boolean, message: String, end: Boolean, winner: String)

/**
  * 聊天对象
  */
case class ChatMessage(sender: String, body: String)

case class ChatResult()

object Chess {

  val LATTICE_SIZE: Int = 19

  /**
    * 所有对局信息
    */
  val battles = mutable.HashMap[String, Chess]()

  /**
    * 所有等待人员
    */
  val waiters_queue = mutable.ArrayStack[String]()

  /**
    * 事件中心
    */
  val event_hub = mutable.HashMap[String, mutable.MutableList[ChessEvent]]()

  /**
    * 寻找对手
    */
  def findOpponent(playerId: String): FindResult = {
    val player1Id = playerId

    // 断线重连
    val myChess = battles.get(player1Id)
    if(!myChess.isEmpty && myChess.get.winner.isEmpty) {
      val player2Id = if(myChess.get.player2Id.equals(player1Id)) myChess.get.player1Id else myChess.get.player2Id
      return FindResult(player1Id, player2Id, myChess.get.offensive)
    }

    // 从等待队列中, 挑一个出来
    for(player2Id <- waiters_queue.iterator) {
      waiters_queue.pop()
      val playChess = battles.get(player2Id)

      if(!player2Id.equals(playerId) &&
          (playChess.isEmpty || !playChess.get.winner.isEmpty)) { // 还没有对局或对局已经结束
        val chess = new Chess(player1Id, player2Id)
        battles.put(player1Id, chess)
        battles.put(player2Id, chess)

        // 查询历史战绩

        // 给对手发送消息
        val event = BattleChessEvent(3, player2Id, player1Id, chess.offensive)
        sendMessage(event, player2Id)

        return FindResult(player1Id, player2Id, chess.offensive)
      }
    }

    // 等待队列中没有对手, 自己进去等待
    waiters_queue.push(playerId)
    return FindResult(player1Id, null, null)
  }

  def attack(playerId: String, x: Int, y: Int): AttackResult = {
    if(x < 1 || x > Chess.LATTICE_SIZE || y < 1 || y > LATTICE_SIZE) {
      // 坐标是否合法
      return AttackResult(false, s"坐标非法($x, $y)", false, "")
    }

    val chessOpt = battles.get(playerId)
    if(chessOpt.isEmpty) {
      return AttackResult(false, "你还没参加战斗", false, "")
    }

    val chess = chessOpt.get
    val result = chess.attack(playerId, x, y)
    if(result.effective == true) { // 进攻有效
      val event = AttackChessEvent(1, playerId, x, y, chess.round, !chess.winner.isEmpty, chess.winner)
      val receiver = if(chess.player1Id.equals(playerId)) chess.player2Id else chess.player1Id

      sendMessage(event, receiver)
    }

    result
  }


  def chat(sender: String, content: String): Unit = {
    val chessOpt = battles.get(sender)
    if(chessOpt.isEmpty) {
      println("你还没参加战斗")
      return
    }

    val chess = chessOpt.get
    val receiver = if(chess.player2Id.equals(sender)) chess.player1Id else chess.player2Id
    sendMessage(MessageChessEvent(2, sender, System.currentTimeMillis(), content), receiver)
  }


  def sendMessage(event: ChessEvent, receiver: String): Unit = {
    if(!event_hub.contains(receiver)) {
      val events = new mutable.MutableList[ChessEvent]()
      events += event
      event_hub.put(receiver, events)
    } else {
      val events = event_hub.get(receiver).get
      events += event
    }
  }

  def getEvents(playerId: String): mutable.MutableList[ChessEvent] = {
    val events = event_hub.get(playerId)

    if(events.isEmpty) {
      mutable.MutableList[ChessEvent]()
    } else {
      event_hub.remove(playerId)
      events.get
    }
  }
}
