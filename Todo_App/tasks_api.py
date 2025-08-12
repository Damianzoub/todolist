from flask import Blueprint , request,jsonify
from flask_login import current_user
from Todo_App import db
from Todo_App.models import Task,User
from datetime import datetime
from Todo_App.middleware.jwt_required import jwt_required
from Todo_App.utils.parse_date import parse_date
#--------------Import Libraries -----------------

tasks_bp = Blueprint("tasks",__name__,url_prefix='/tasks')


#FOR ADDING A TASK (NOT COMPLETED)
@tasks_bp.route('/add_task',methods=['POST'])
@jwt_required
def add_task():
    try:
        #FIX IT , IT IS NOT READY YET
        data = request.get_json()
        #Retrieve Data 
        task_name = (data.get('task_name')).strip()
        description =(data.get('description')).strip()
        due_date = data.get('due_date')
        priority = data.get('priority',None)
        print("done")
        if not task_name:
            return jsonify({
                "success":False,
                "message":"Task Name wasn't given"
            }),400

        try:
            due_date_obj = parse_date(due_date) if due_date else None
        except ValueError as ValErr:
            return jsonify({
                "success":False,
                "message":f"{ValErr}"
            }),400
        print("done")
        user = request.user
        if not user:
            return jsonify({
                "success":False,
                "message":"User dont exist"
            }),404
        #Create Task
        task = Task(task_name=task_name,
                    description = description,
                    due_date= due_date_obj,
                    priority= int(priority),
                    user_id = user.user_id)
        print("done")
        #Put in the DB
        db.session.add(task)
        db.session.commit()
        print("done")
        return jsonify({
            "succes":True,
            "message": "Task added succesfully" 
        }),200
    except Exception as e:
        return jsonify({
            "success":False,
            "message": f"Error occured: {e}"
        }),503

#FOR GETTING THE TASK OF THE USER
@tasks_bp.route('/show_tasks',methods=['GET'])
@jwt_required
def get_task():
    try:
        user = request.user 
        print("done")
        if not user:
            return jsonify({
                "success":False,
                "message":"User dont exist"
            }),404
        print('done')
        tasks = Task.query.filter_by(user_id=user.user_id).order_by(Task.due_date).all()
        print('done')

        def to_dict(t:Task):
            return {
                "task_id":t.task_id,
                "task_name":t.task_name,
                "description":t.description,
                "due_date":t.due_date,
                "priority":t.priority,
                "user_id":t.user_id
            }

        return jsonify({
            "success":True,
            "data":[to_dict(t) for t in tasks],
            "message":"Returned Tasks successfully"
        }),200
    except Exception as e:
        return jsonify({
            "success":False,
            "message":f"Error occured: {e}"
        }),503
    
#FOR DELETING A TASK
@tasks_bp.route('/delete_task',methods=['DELETE'])
@jwt_required
def delete_task():
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        if not task_id:
            return jsonify({
                'successs':False,
                "message":f"Data didn't passed"
            }),400
        
        user = request.user
        if not user :
            return jsonify({
                "success":False,
                "message":"user dont exist"
            }),404
        #Filter by task_id column and user_id
        task = Task.query.filter_by(task_id=task_id,user_id = user.user_id ).all()
        if not task:
            return jsonify({
                "success":True,
                "message":f"Doesn't contain Tasks"
            }),400
        
        db.session.delete(task)
        db.session.commit()

        return jsonify({
            "success":True,
            "message":"Task deleted successfully"
        }),200

    except Exception as e:
        return jsonify({
            "success":False,
            "message": f"Error occurred: {e}"
        })

@tasks_bp.route('/modify',methods=["PUT"])
def modify():
  try:  
    data = request.get_json()
    task_id = data.get('task_id')
    if not task_id:
        return jsonify({
            "success":False,
            "message":f"Didn't receive any task"
        }),400
    user = request.user 
    if not user:
        return jsonify({
            "success":False,
            "message":"User not found"
        }),404
    task = Task.query.filter_by(task_id=task_id,user_id=user.user_id).first()
    if not task:
        return jsonify({
            "success":False,
            "message":f"Task wasn't able to load"
        }),404
    #IF ABOUT THE TASKS CONTENT TO CHANGE 
    if "task_name" in data:
        task.task_name = data.get('task_name')
    if "description" in data:
        task.description = data.get('description')
    if "due_date" in data:
        task.due_date = data.get('due_date')
    if "priority" in data:
        task.priority = data.get('priority')
    db.session.commit()
    return jsonify({
        "success":True,
        "message":f"Task modified succesfully"
    }),200
  except Exception as e:
      return jsonify({
          "success":False,
          "message":f"Something went wrong: {e}"
      }),503
      