const { Thought, User } = require('../models');

const thoughtController = {
 
  async getAllThoughts(req, res) {
    try {
      const dbThoughtInfo = await Thought.find();

      res.status(200).json(dbThoughtInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getThoughtById(req, res) {
    try {
      const dbThoughtInfo = await Thought.findById({ _id: req.params.thoughtId })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v');

      if (!dbThoughtInfo) {
        res.status(404).json({ message: `Can't find thought with that id.` });
        return;
      }

      res.status(200).json(dbThoughtInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const { thoughtText, username, userId } = req.body;

      const dbThoughtInfo = await Thought.create({ thoughtText, username });

      const dbUserInfo = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { thoughts: dbThoughtInfo._id }},
        { new: true, runValidators: true }
      )
        .populate(
          {
            path: 'thoughts',
            select: '-__v'
          }
        )
        .select('-__v');

      if (!dbUserInfo) {
        res.status(404).json({ message: `Can't find user with that id.` });
        await Thought.findByIdAndDelete({ _id: dbThoughtInfo._id });
        return;
      }

      res.status(200).json(dbUserInfo)

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const { thoughtText, username } = req.body;

      const dbThoughtInfo = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText, username },
        { new: true, runValidators: true }
      );

      if (!dbThoughtInfo) {
        res.status(404).json({ message: `Can't find thought with that id.` });
        return;
      }

      res.status(200).json(dbThoughtInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const dbThoughtInfo = await Thought.findByIdAndDelete({ _id: req.params.ThoughtId });

      if (!dbThoughtInfo) {
        res.status(404).json({ message: `Can't find thought with that id.` });
        return;
      }

      const dbUserInfo = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { thoughts: req.params.thoughtId }},
        { new: true, runValidators: true }
      );

      if (!dbUserInfo) {
        res.status(404).json({ message: `Can't find user with that id.` });
        return;
      }

      res.status(200).json(dbUserInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;

      const dbThoughtInfo = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: { reactionBody, username } } },
        { new: true, runValidators: true }
      );

      if (!dbThoughtInfo) {
        res.status(404).json({ message: `Can't find thought with that id.` });
        return;
      }

      res.status(200).json(dbThoughtInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const dbThoughtInfo = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true, runValidators: true }
      );

      if (!dbThoughtInfo) {
        res.status(404).json({ message: `Can't find thought with that id.` });
        return;
      }

      res.status(200).json(dbThoughtInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

};

module.exports = thoughtController; 